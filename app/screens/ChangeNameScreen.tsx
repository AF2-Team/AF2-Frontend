import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const ChangeNameScreen = () => {
  const router = useRouter();

  // Estado para el nombre
  const [name, setName] = useState("");
  
  // Estado para controlar si el botón guardar está activo
  const isSaveEnabled = name.trim().length > 0;

  // Estado del Modal de Éxito
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleSave = () => {
    if (isSaveEnabled) {
      // 1. Aquí iría tu lógica para guardar el nombre en la base de datos/API
      // console.log("Guardando nombre:", name);

      // 2. Mostrar el modal de éxito
      setSuccessModalVisible(true);

      // 3. Esperar 2 segundos y volver atrás
      setTimeout(() => {
        setSuccessModalVisible(false);
        router.back();
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSave} 
          disabled={!isSaveEnabled}
        >
          <Text style={[
            styles.saveButton, 
            isSaveEnabled ? styles.saveButtonActive : styles.saveButtonDisabled
          ]}>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- CONTENIDO --- */}
      <View style={styles.content}>
        <Text style={styles.title}>¿Qué nombre te gustaría usar?</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="nombre"
          placeholderTextColor="#BDBDBD"
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      {/* --- MODAL DE ÉXITO (TOAST) --- */}
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
              ¡Listo! Tu nombre de usuario ha sido actualizado.
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
    marginTop: 14, // Ajuste para separar un poco del StatusBar
  },
  cancelButton: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Open Sans", // Si usas fuentes personalizadas
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonDisabled: {
    color: "#BDBDBD", // Gris cuando no hay texto
  },
  saveButtonActive: {
    color: "#2196F3", // Azul brillante como en la imagen
  },
  content: {
    flex: 1,
    justifyContent: "center", // Centra verticalmente el contenido
    paddingHorizontal: 30,
    paddingBottom: 150, // Sube el contenido visualmente para que no esté tan abajo
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#423646", // Tu color morado oscuro o negro #333
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#423646", // Línea oscura
    fontSize: 18,
    paddingVertical: 8,
    color: "#423646",
    textAlign: "left",
  },

  // --- Estilos del Modal de Éxito ---
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Alinea al fondo de la pantalla
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)", // Fondo gris tenue
    paddingBottom: 50, // Espacio desde el borde inferior
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD", // Fondo azul muy claro
    borderColor: "#2196F3", // Borde azul
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: "90%", // Ocupa casi todo el ancho
    justifyContent: "center",
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2196F3", // Círculo azul
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  successText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1, // Asegura que el texto no rompa el layout
  },
});

export default ChangeNameScreen;