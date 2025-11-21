import { Alegreya_400Regular_Italic, useFonts } from "@expo-google-fonts/alegreya";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// 1. IMPORTAR EL HOOK DE EXPO ROUTER
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const ConfigurationScreen = () => { // Ya no necesitamos recibir { navigation } por props
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  
  // 2. INICIALIZAR EL ROUTER
  const router = useRouter(); 

  const [fontsLoaded] = useFonts({
    Alegreya_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  const confirmLogout = () => {
    // Cierra el modal de pregunta
    setModalVisible(false);
    // Abre el modal de "Hasta la luego"
    setLoadingVisible(true);

    setTimeout(() => {
      setLoadingVisible(false);
      
      // 3. REDIRECCIÓN A index.tsx
      // "/" apunta automáticamente a app/index.tsx
      // Usamos 'replace' en lugar de 'push' para borrar el historial y que no puedan volver atrás
      router.replace("/"); 
      
    }, 2000);
  };

  const handlePress = (action) => {
    if (action === "logout") {
      setModalVisible(true);
    } else if (action === "changePassword") {
        // Navegar a la pantalla de cambio de contraseña
        router.push("/screens/ChangePasswordScreen");
    }else if (action === "changeName") {
        // Navegar a la pantalla de cambio de nombre
        router.push("/screens/ChangeNameScreen");
    }
      else {
        console.log(`Navegar a: ${action}`);
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#423646" barStyle="light-content" />

      {/* --- MODAL DE CONFIRMACIÓN  --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              ¿Seguro que quieres cerrar la sesión?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              {/* Al presionar SI, se ejecuta confirmLogout que llama al router */}
              <TouchableOpacity onPress={confirmLogout}>
                <Text style={styles.modalConfirmText}>Si</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE CARGA --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loadingVisible}
        onRequestClose={() => {}} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loadingModalContainer}>
            <Text style={styles.loadingText}>¡Hasta la luego!</Text>
            <ActivityIndicator size="large" color="#2196F3" style={styles.spinner} />
          </View>
        </View>
      </Modal>
      
      {/* --- Resto de tu UI (Header y Menú) --- */}
      <View style={styles.headerContainer}>
        {/* Para volver atrás con Expo Router */}
        <TouchableOpacity onPress={() => router.push("/screens/ProfileUserScreen")} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handlePress("logout")}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="power" size={26} color="#423646" />
          </View>
          <Text style={styles.menuText}>Cerrar sesión</Text>
          </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => handlePress("changeName")}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="account" size={26} color="#423646" />
          </View>
          <Text style={styles.menuText}>Cambiar nombre</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.lastMenuItem]} 
          onPress={() => handlePress("changePassword")}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="lock" size={26} color="#423646" />
          </View>
          <Text style={styles.menuText}>Cambiar contraseña</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    height: 70,
    backgroundColor: "#423646",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 4,
  },
  backButton: { marginRight: 20, padding: 5 },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "500",
    marginLeft: 10,
  },
  contentContainer: { paddingTop: 0 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  lastMenuItem: { borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
  iconContainer: { width: 40, alignItems: "flex-start" },
  menuText: { fontSize: 18, color: "#000", fontFamily: "Open Sans" },
  footer: {
    height: 40,
    backgroundColor: "#423646",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  // --- Estilos de Modals ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#9E9E9E",
    fontWeight: "500",
    marginRight: 25,
    padding: 10,
  },
  modalConfirmText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "bold",
    padding: 10,
  },

  // --- Estilos NUEVOS para el Modal de Carga ---
  loadingModalContainer: {
    width: width * 0.85, // Mismo ancho que el anterior
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 30, // Más espacio vertical
    paddingHorizontal: 20,
    alignItems: "center", // Centrar contenido
    elevation: 10,
  },
  loadingText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500", // O "bold" si lo prefieres más grueso
    marginBottom: 20,
  },
  spinner: {
    marginTop: 10,
    transform: [{ scale: 1.5 }] // Hacemos el spinner un poco más grande visualmente
  }
});

export default ConfigurationScreen;