import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Holaaaaaaaaaaaaaaaa",
      time: "20 de junio 8:59 a. m.",
      isSent: false // Mensaje recibido
    }
  ]);
  // Función para enviar mensaje
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        time: new Date().toLocaleString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          hour: 'numeric', 
          minute: 'numeric',
          hour12: true 
        }),
        isSent: true // Mensaje enviado
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage(""); // Limpiar input
    }
  };
  // Renderizar mensajes dinámicamente
  const renderMessage = (msg) => (
    <View key={msg.id} style={[
      styles.messageRow, 
      msg.isSent && styles.sentMessageRow
    ]}>
      <View style={[
        styles.messageBubble,
        msg.isSent && styles.sentMessageBubble
      ]}>
        <Text style={styles.messageText}>{msg.text}</Text>
      </View>
      <Text style={styles.messageTime}>{msg.time}</Text>
    </View>
  );


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
        
        {/* Info del usuario */}
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: "https://i.pravatar.cc/150?u=snailsfall" }} 
            style={styles.bigAvatar} 
          />
          <Text style={styles.userNameBig}>snailsfall</Text>
          <Text style={styles.userStatus}>Siguiendo</Text>
        </View>

        {/* Mensajes dinámicos */}
        {messages.map(renderMessage)}
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
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
          />
        </View>
        
        <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconButton}>
               <Ionicons name="image-outline" size={28} color="#333" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleSendMessage}
            >
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
    marginTop:15,
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
  },
  iconButton: {
    padding: 8,
  },
  sentMessageRow: {
    alignItems: "flex-end",
  },
  sentMessageBubble: {
    backgroundColor: "#DCF8C6", // Color diferente para mensajes enviados
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
  },
});

export default ChatDetailScreen;