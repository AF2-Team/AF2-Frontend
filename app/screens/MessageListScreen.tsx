import { NavigationBar } from "@/components/NavigationBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants";


const { width } = Dimensions.get("window");

// Datos de prueba iniciales
const initialMessages = [
  {
    id: "1",
    user: "snailsfall",
    lastMessage: "Holaaaaaaaaaaaaaaaa",
    avatar: "https://i.pravatar.cc/150?u=snailsfall", // Avatar aleatorio
  },
];

const MessagesListScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets(); 
  // --- ESTADOS ---
  const [messages, setMessages] = useState(initialMessages);
  const [selectedChat, setSelectedChat] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // --- LÓGICA ---
  
  // Abrir modal de opciones (simulado con long press o botón)
  const handleOpenOptions = (chat) => {
    setSelectedChat(chat);
    setModalVisible(true);
  };

  // Borrar conversación
  const handleDeleteConversation = () => {
    // 1. Ocultar modal
    setModalVisible(false);

    // 2. Eliminar de la lista visualmente
    setMessages((prev) => prev.filter((msg) => msg.id !== selectedChat.id));

    // 3. Mostrar Toast de confirmación
    setToastVisible(true);

    // 4. Ocultar Toast después de 3 segundos
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // Navegar al detalle (ChatDetail)
  const goToChat = () => {
    // En una app real pasarías el ID: router.push(`/chat/${item.id}`)
    router.push("/screens/ChatDetailScreen"); 
  };

  // Renderizado de cada item de la lista
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={goToChat}
      onLongPress={() => handleOpenOptions(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatUser}>{item.user}</Text>
        <Text style={styles.chatPreview}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.fullContainer}>
      <StatusBar backgroundColor="#423646" barStyle="light-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>broken-hours</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => router.push("/screens/NotificationScreen")}
          >
            <Text style={styles.tabTextInactive}>Actividad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, styles.tabActive]}>
            <Text style={styles.tabTextActive}>Mensajes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- BODY (LISTA) --- */}
      <View style={styles.mainContent}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={{ flex: 1 }} /> 
          }
        />

        {/* --- FLOATING ACTION BUTTON (FAB) --- */}
        <TouchableOpacity style={styles.fab}>
          <MaterialCommunityIcons name="message-text-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* --- MODAL DE BORRADO (BOTTOM SHEET) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* ... código del modal existente ... */}
      </Modal>

      {/* --- TOAST DE CONFIRMACIÓN --- */}
      {toastVisible && (
        <View style={styles.toastContainer}>
          {/* ... código del toast existente ... */}
        </View>
      )}

      {/* --- ÁREA INFERIOR CON NAVIGATIONBAR --- */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom }]}>
        <NavigationBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  
  // Header Styles
  header: {
    backgroundColor: "#423646",
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
    marginTop: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-between",
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabTextInactive: { color: "#AAA", fontWeight: "600" },
  tabTextActive: { color: "#000", fontWeight: "bold" },

  // List Styles
  body: { flex: 1 },
  listContent: { padding: 0 },
  chatItem: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8, // Cuadrado redondeado como en la foto
    marginRight: 15,
    backgroundColor: "#ddd",
  },
  chatInfo: { flex: 1 },
  chatUser: { fontWeight: "bold", fontSize: 16, marginBottom: 2 },
  chatPreview: { color: "#666", fontSize: 14 },

  // FAB
  fab: {
    position: "absolute",
    bottom: 80, // Ajustar para que esté arriba del NavigationBar
    right: 20,
    backgroundColor: "#2196F3",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalBody: { padding: 20 },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalOptionText: { fontSize: 16, marginLeft: 15 },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: { fontSize: 16, fontWeight: "bold" },

  // Toast Styles
  toastContainer: {
    position: "absolute",
    bottom: 90, // Encima del menú inferior
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "90%",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  toastText: { color: "#000", fontWeight: "500" },

  // Bottom Nav Styles
  bottomNav: {
    backgroundColor: Colors.tabBarBackground,
    width: "100%",
  },
  fullContainer: {
    flex: 1,
    backgroundColor: Colors.tabBarBackground,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bottomArea: {
    backgroundColor: Colors.tabBarBackground,
    width: "100%",
  },
});

export default MessagesListScreen;