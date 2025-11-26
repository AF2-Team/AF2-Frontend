import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ChangePasswordScreen = () => {
  const router = useRouter();

  // Estados del formulario
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- ESTADOS DE VISIBILIDAD DE CONTRASEÑA --- // <--- NUEVO
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Estado de validación
  const [error, setError] = useState("");
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  // Estado del Modal de Éxito
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Efecto para validar en tiempo real y habilitar el botón Guardar
  useEffect(() => {
    // Lógica simple de validación
    if (newPassword.length > 0 && newPassword.length < 8) {
      setError(
        "La contraseña tiene menos de 8 caracteres.\nIngrese una contraseña más larga",
      );
    } else {
      setError("");
    }

    // Habilitar botón solo si todo está correcto
    if (
      currentPassword.length > 0 &&
      newPassword.length >= 8 &&
      newPassword === confirmPassword
    ) {
      setIsSaveEnabled(true);
    } else {
      setIsSaveEnabled(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSave = () => {
    if (isSaveEnabled) {
      // Aquí iría la lógica para enviar al backend
      setSuccessModalVisible(true);

      // Opcional: Cerrar automáticamente y volver atrás después de unos segundos
      setTimeout(() => {
        setSuccessModalVisible(false);
        router.back();
      }, 2000);
    }
  };

  // Función auxiliar para renderizar el icono del ojo
  const renderEyeIcon: (isVisibel: boolean, setIsVisible: any) => any = (
    isVisible,
    setIsVisible,
  ) => (
    <TouchableOpacity
      onPress={() => setIsVisible(!isVisible)}
      style={styles.eyeIconButton}
    >
      <MaterialCommunityIcons
        name={isVisible ? "eye" : "eye-off"}
        size={22}
        color="#BDBDBD" // Color gris claro para el icono inactivo
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} disabled={!isSaveEnabled}>
          <Text
            style={[
              styles.saveButton,
              isSaveEnabled
                ? styles.saveButtonActive
                : styles.saveButtonDisabled,
            ]}
          >
            Guardar
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- CONTENIDO DEL FORMULARIO --- */}
      <View style={styles.content}>
        <Text style={styles.title}>Cambio de contraseña</Text>

        {/* Input 1: Contraseña Actual */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña actual</Text>
          {/* Usamos un contenedor para el input y el icono */}
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showCurrentPass} // Controlado por el estado
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="•••••••••"
              placeholderTextColor="#ccc"
            />
            {renderEyeIcon(showCurrentPass, setShowCurrentPass)}
          </View>
        </View>

        {/* Input 2: Contraseña Nueva */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña nueva</Text>
          {/* Aplicamos el estilo de error al contenedor, no al input directo */}
          <View
            style={[
              styles.passwordInputContainer,
              error ? styles.inputError : null,
            ]}
          >
            <TextInput
              style={styles.input}
              secureTextEntry={!showNewPass}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Al menos 8 caracteres"
              placeholderTextColor="#ccc"
            />
            {renderEyeIcon(showNewPass, setShowNewPass)}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Input 3: Confirmar Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirmPass}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Al menos 8 caracteres"
              placeholderTextColor="#ccc"
            />
            {renderEyeIcon(showConfirmPass, setShowConfirmPass)}
          </View>
        </View>
      </View>

      {/* --- MODAL DE ÉXITO --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successBadge}>
            <View style={styles.checkboxCircle}>
              <MaterialCommunityIcons name="check" size={16} color="#fff" />
            </View>
            <Text style={styles.successText}>
              ¡Listo! Tu contraseña ha sido actualizada.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 23,
  },
  cancelButton: {
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonDisabled: {
    color: "#BDBDBD",
  },
  saveButtonActive: {
    color: "#423646",
  },
  content: {
    paddingHorizontal: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#423646",
    textAlign: "center",
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },

  // --- NUEVOS ESTILOS PARA INPUTS CON ICONO ---
  passwordInputContainer: {
    flexDirection: "row", // Alinear input e icono horizontalmente
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
  },
  input: {
    flex: 1, // El input toma todo el espacio disponible
    fontSize: 16,
    paddingVertical: 0, // Ajuste para alinear mejor con el icono
    color: "#000",
    // Se eliminaron borderBottomWidth y paddingVertical anteriores de aquí
  },
  eyeIconButton: {
    padding: 5, // Área táctil un poco más grande
  },
  // --------------------------------------------

  inputError: {
    borderBottomColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 5,
    lineHeight: 16,
  },

  // --- Estilos del Modal de Éxito (sin cambios) ---
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingBottom: 50,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "90%",
    justifyContent: "center",
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  successText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ChangePasswordScreen;
