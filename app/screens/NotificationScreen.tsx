import { NavigationBar } from "@/components/NavigationBar";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants";

const { width } = Dimensions.get("window");

// Datos simulados agrupados por fecha (Sections)
const NOTIFICATIONS = [
  {
    title: "Ayer",
    dateRight: "jueves, 19 de junio",
    data: [
      {
        id: "1",
        user: "sugar-coated-prat-the-dragon",
        action: "Te ha respondido en una publicación.",
        avatar: "https://i.pravatar.cc/150?u=dragon",
      },
    ],
  },
  {
    title: "Hace 4 días",
    dateRight: "jueves, 16 de junio",
    data: [
      {
        id: "2",
        user: "luciferthenewgod",
        action: "Ha compartido tu publicación.",
        avatar: "https://i.pravatar.cc/150?u=lucifer",
      },
      {
        id: "3",
        user: "a-boy-called-micah",
        action: "Ha indicado que le gusta tu publicación.",
        avatar: "https://i.pravatar.cc/150?u=micah",
      },
    ],
  },
];

const NotificationScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Función para navegar a la pestaña de Mensajes
  const goToMessages = () => {
    // Asumiendo que tu pantalla de lista de mensajes está en la ruta /messages
    // O puedes usar router.replace si no quieres guardar historial entre pestañas
    router.replace("/screens/MessageListScreen"); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.usernameText}>
            {item.user}
        </Text>
        <Text style={styles.actionText}>
            {item.action}
        </Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title, dateRight } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDate}>{dateRight}</Text>
    </View>
  );

  return (
    <View style={styles.fullContainer}>
      <StatusBar backgroundColor="#423646" barStyle="light-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>broken-hours</Text>
        <View style={styles.tabContainer}>
          {/* Botón Actividad (ACTIVO) */}
          <TouchableOpacity style={[styles.tabButton, styles.tabActive]}>
            <Text style={styles.tabTextActive}>Actividad</Text>
          </TouchableOpacity>

          {/* Botón Mensajes (INACTIVO) - Navega al hacer clic */}
          <TouchableOpacity style={styles.tabButton} onPress={goToMessages}>
            <Text style={styles.tabTextInactive}>Mensajes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- SUB-HEADER --- */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Toda la actividad</Text>
      </View>

      {/* --- LISTA DE ACTIVIDAD --- */}
      <View style={styles.mainContent}>
        <SectionList
          sections={NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          stickySectionHeadersEnabled={false}
        />
      </View>

      {/* --- ÁREA INFERIOR CON NAVIGATIONBAR --- */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom }]}>
        <NavigationBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // --- Header Styles ---
  header: {
    backgroundColor: "#423646",
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
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
  // Estilo activo (Fondo blanco)
  tabActive: {
    backgroundColor: "#fff",
  },
  tabTextActive: { color: "#000", fontWeight: "bold" },
  tabTextInactive: { color: "#AAA", fontWeight: "600" },

  // --- Sub Header "Toda la actividad" ---
  subHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },

  // --- Section List Styles ---
  listContent: { 
    paddingBottom: 20},
  
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff", // Fondo blanco
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  sectionDate: {
    fontSize: 12,
    color: "#999",
  },

  itemContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
    marginBottom: 2,
  },
  actionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 80, // Indentación para que la línea empiece después del avatar (opcional)
  },

  // --- Bottom Nav Styles ---
  bottomNav: {
    height: 60,
    backgroundColor: "#423646",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
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

export default NotificationScreen;