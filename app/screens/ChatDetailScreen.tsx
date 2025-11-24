import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const ChatDetailScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* --- HEADER CHAT --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Image 
            source={{ uri: "https://i.pravatar.cc/150?u=snailsfall" }} 
            style={styles.headerAvatar} 
          />
          <Text style={styles.headerName}>snailsfall</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* --- AREA DE MENSAJES --- */}
      <View style={styles.chatArea}>
        
        {/* Info del usuario (Parte superior del chat) */}
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: "https://i.pravatar.cc/150?u=snailsfall" }} 
            style={styles.bigAvatar} 
          />
          <Text style={styles.userNameBig}>snailsfall</Text>
          <Text style={styles.userStatus}>Siguiendo</Text>
        </View>

        {/* Burbuja de mensaje */}
        <View style={styles.messageRow}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>Holaaaaaaaaaaaaaaaa</Text>
          </View>
          <Text style={styles.messageTime}>20 de junio 8:59 a. m.</Text>
        </View>

      </View>

      {/* --- INPUT FOOTER --- */}
      <View style={styles.inputContainer}>
        <View style={styles.inputBackground}>
          <Image 
             // Aquí iría tu imagen pequeña de avatar o placeholder
             source={{ uri: "https://i.pravatar.cc/150?u=me" }} 
             style={styles.inputAvatar} 
          />
          <TextInput 
            placeholder="Escribe un mensaje, broken-hours"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </View>
        
        <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconButton}>
               <Ionicons name="image-outline" size={28} color="#333" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
               <Ionicons name="send-outline" size={28} color="#000" />
            </TouchableOpacity>
        </View>
      </View>
      
      {/* Footer oscuro decorativo (parte del diseño global de tu app) */}
      <View style={styles.decorativeFooter} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  headerName: { fontSize: 18, fontWeight: "bold" },

  // Chat Area
  chatArea: { flex: 1, padding: 20 },
  
  userInfoContainer: { alignItems: "center", marginBottom: 30, marginTop: 10 },
  bigAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  userNameBig: { fontSize: 18, fontWeight: "bold" },
  userStatus: { color: "#666", fontSize: 14 },

  messageRow: { alignItems: "flex-start" },
  messageBubble: {
    backgroundColor: "#C4C4C4", // Gris de la imagen
    padding: 12,
    borderRadius: 10,
    borderBottomLeftRadius: 0, // Estilo burbuja
  },
  messageText: { fontSize: 16, color: "#000" },
  messageTime: { fontSize: 12, color: "#666", marginTop: 5 },

  // Input
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  inputBackground: {
    backgroundColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
  },
  inputAvatar: {
      width: 30, height: 30, borderRadius: 15, marginRight: 10
  },
  input: { flex: 1, fontSize: 16 },
  
  iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginBottom: 5
  },

  decorativeFooter: {
      height: 40,
      backgroundColor: "#423646",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
  }
});

export default ChatDetailScreen;