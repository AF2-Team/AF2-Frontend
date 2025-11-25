import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// --- DATOS DE PRUEBA (MOCKS) ---

const RECENT_SEARCHES = ["Sineala", "Ao3", "Fanfiction"];

const FOLLOWED_TAGS = [
  { id: "1", tag: "#destiel", img: "https://i.pravatar.cc/150?img=11" },
  { id: "2", tag: "#flowers", img: "https://i.pravatar.cc/150?img=25" },
  { id: "3", tag: "#remmick", img: "https://i.pravatar.cc/150?img=3" },
  { id: "4", tag: "#sentryagent", img: "https://i.pravatar.cc/150?img=4" },
];

const POSTS = [
  {
    id: "1",
    user: "liminaltey",
    avatar: "https://i.pravatar.cc/150?img=12",
    time: "1 día",
    title: "¿Crees que el AO3 debería prohibir las obras generadas por IA?",
    content: "Bueno, en teoría, puede sonar ideal. ¿Pero en realidad? No.\nNo soy fanático de la IA, pero \"¿crees que el AO3 debería prohibir?\" nunca resuelve un problema. Porque, ¿cómo se puede saber qué es IA...?",
    image: null,
    tags: ["#gardenverse", "#fanfic", "#writing", "#writers"],
    notes: 9,
  },
  {
    id: "2",
    user: "dominiqueramseyart",
    avatar: "https://i.pravatar.cc/150?img=5",
    time: "5 oct",
    title: "",
    content: "Rambling rose\n2022",
    image: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&w=800&q=80", // Lobo con rosa
    tags: ["#artist", "#wolf", "#rose", "#flower", "#fanart"],
    notes: 300,
  },
  {
    id: "3",
    user: "himekokosu",
    avatar: "https://i.pravatar.cc/150?img=32",
    time: "Hace 6 días",
    title: "",
    content: "Solo recordando",
    image: "https://i.pinimg.com/736x/2a/3a/07/2a3a0784570562624505315582255734.jpg", // Meme placeholder
    tags: ["#the fact that fanfom is for nerds"],
    notes: 15,
  },
];

const PROFILES = [
  {
    id: "1",
    name: "llovinghome",
    handle: "Ya estoy en casa?",
    avatar: "https://i.pravatar.cc/150?img=60",
    banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", // Casa campo
  },
  {
    id: "2",
    name: "geopsych",
    handle: "Un recolector pero por la belleza",
    avatar: "https://images.unsplash.com/photo-1590422915835-263a0a386121?auto=format&fit=crop&w=200&q=80", // Hongos
    banner: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80", // Arte abstracto azul
  },
];

// --- COMPONENTE PRINCIPAL ---

const SearchScreen = () => {
  const router = useRouter();
  
  // Estados
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Tabs: 'Publicaciones' | 'Etiquetas' | 'Perfiles'
  const [activeTab, setActiveTab] = useState("Publicaciones");
  
  // Sub-filtro: 'Populares' | 'Recientes'
  const [sortOption, setSortOption] = useState("Populares");
  const [modalVisible, setModalVisible] = useState(false);

  // Manejadores
  const handleSearchSubmit = () => {
    if (searchText.trim().length > 0) {
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setIsSearching(false);
  };

  const handleTagPress = (tag) => {
    setSearchText(tag);
    setIsSearching(true);
  };

  // --- RENDERIZADO: ITEMS DE LA LISTA DE POSTS ---
  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      {/* Header del Post */}
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
        <View>
          <Text style={styles.postUser}>{item.user}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        <TouchableOpacity style={styles.followButtonSmall}>
            <Text style={styles.followButtonTextSmall}>Seguir</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      {item.title ? <Text style={styles.postTitle}>{item.title}</Text> : null}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
      )}
      <Text style={styles.postContent}>{item.content}</Text>
      
      {/* Tags */}
      <View style={styles.tagRow}>
        {item.tags.map((tag, index) => (
            <Text key={index} style={styles.postTag}>{tag} </Text>
        ))}
      </View>

      {/* Footer / Acciones */}
      <View style={styles.postFooter}>
        <View style={styles.notesContainer}>
           <Text style={styles.notesText}>{item.notes} notas</Text>
        </View>
        <View style={styles.actionsContainer}>
            <MaterialCommunityIcons name="comment-outline" size={24} color="#555" style={styles.actionIcon} />
            <MaterialCommunityIcons name="repeat" size={24} color="#555" style={styles.actionIcon} />
            <MaterialCommunityIcons name="star-outline" size={24} color="#555" style={styles.actionIcon} />
            <MaterialCommunityIcons name="heart-outline" size={24} color="#555" style={styles.actionIcon} />
        </View>
      </View>
    </View>
  );

  // --- RENDERIZADO: ITEMS DE PERFILES ---
  const renderProfileItem = ({ item }) => (
    <View style={styles.profileCard}>
      <View style={styles.bannerContainer}>
          <Image source={{ uri: item.banner }} style={styles.profileBanner} />
          <TouchableOpacity style={styles.profileFollowBtn}>
              <Text style={styles.profileFollowText}>Seguir</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.profileInfoContainer}>
          <Image source={{ uri: item.avatar }} style={styles.profileAvatarAbsolute} />
          <View style={styles.profileTexts}>
             <Text style={styles.profileName}>{item.name}</Text>
             <Text style={styles.profileHandle}>{item.handle}</Text>
          </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#423646" barStyle="light-content" />

      {/* --- HEADER PRINCIPAL --- */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
            {isSearching ? (
                <TouchableOpacity onPress={handleClearSearch} style={{marginRight: 10}}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => router.back()} style={{marginRight: 10}}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
            )}
            
            {/* Título dinámico: "Explorar" o el texto de búsqueda */}
            <Text style={styles.headerTitle}>
                {isSearching ? searchText : "Explorar"}
            </Text>

            {/* Botón Seguir (solo si estamos buscando) */}
            {isSearching && (
                 <TouchableOpacity style={styles.headerFollowButton}>
                    <Text style={styles.headerFollowText}>Seguir</Text>
                 </TouchableOpacity>
            )}
        </View>

        {/* Barra de Búsqueda */}
        <View style={styles.searchBarContainer}>
           <TextInput 
              style={styles.searchBar}
              placeholder="Buscar..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
           />
           <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
        </View>
      </View>

      {/* --- CONTENIDO CONDICIONAL --- */}
      {!isSearching ? (
        // === VISTA 1: EXPLORAR (LANDING) ===
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Recientes</Text>
          {RECENT_SEARCHES.map((term, index) => (
            <TouchableOpacity key={index} style={styles.recentItem} onPress={() => handleTagPress(term)}>
               <Ionicons name="search-outline" size={22} color="#555" />
               <Text style={styles.recentText}>{term}</Text>
               <Ionicons name="close" size={22} color="#555" style={{ marginLeft: "auto"}} />
            </TouchableOpacity>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Etiquetas que sigues</Text>
          {FOLLOWED_TAGS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.tagItem} onPress={() => handleTagPress(item.tag)}>
               <Image source={{ uri: item.img }} style={styles.tagImage} />
               <Text style={styles.tagText}>{item.tag}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Ver las etiquetas que sigues</Text>
              <Ionicons name="arrow-forward" size={20} />
          </TouchableOpacity>
        </ScrollView>

      ) : (
        // === VISTA 2: RESULTADOS DE BÚSQUEDA ===
        <View style={{ flex: 1 }}>
            
            {/* Header Especial #gardenverse (Imagen 2) */}
            {searchText.toLowerCase() === "#gardenverse" && (
                <ImageBackground 
                    source={{uri: "https://images.unsplash.com/photo-1507746560942-02f58be5b042?auto=format&fit=crop&w=800&q=80"}} // Flor blanca
                    style={styles.imageHeader}
                >
                    <View style={styles.imageHeaderOverlay}>
                        <Text style={styles.imageHeaderTitle}>#gardenverse</Text>
                        <TouchableOpacity style={styles.headerFollowButtonBlue}>
                            <Text style={styles.headerFollowText}>Seguir</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            )}

            {/* TABS (Publicaciones / Etiquetas / Perfiles) */}
            <View style={styles.tabsContainer}>
                {["Publicaciones", "Etiquetas", "Perfiles"].map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[styles.tab, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* FILTRO SECUNDARIO (Populares / Dropdown) */}
            {activeTab === "Publicaciones" && (
                 <View style={styles.subFilterContainer}>
                    <TouchableOpacity 
                        style={styles.dropdownButton} 
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.dropdownText}>{sortOption}</Text>
                        <Ionicons name="chevron-down" size={16} color="#2196F3" />
                    </TouchableOpacity>
                 </View>
            )}

            {/* LISTAS SEGÚN TAB */}
            {activeTab === "Publicaciones" ? (
                <FlatList
                    data={POSTS}
                    renderItem={renderPostItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            ) : activeTab === "Perfiles" ? (
                <FlatList
                    data={PROFILES}
                    renderItem={renderProfileItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            ) : (
                <View style={styles.centerContent}><Text>No hay etiquetas aquí</Text></View>
            )}

            {/* FAB (Botón Flotante para escribir) */}
            <TouchableOpacity style={styles.fab}>
                <MaterialCommunityIcons name="pencil" size={28} color="#fff" />
            </TouchableOpacity>

        </View>
      )}

      {/* --- MODAL DE ORDENAMIENTO (BOTTOM SHEET) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
         <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}
         >
            <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Orden</Text>
                
                {/* Opción Populares */}
                <TouchableOpacity 
                    style={styles.modalOption} 
                    onPress={() => { setSortOption("Populares"); setModalVisible(false); }}
                >
                    <Text style={styles.modalOptionText}>Populares</Text>
                    {sortOption === "Populares" && <Ionicons name="checkmark" size={24} color="#2196F3" />}
                </TouchableOpacity>

                <View style={styles.modalSeparator} />

                {/* Opción Recientes */}
                <TouchableOpacity 
                    style={styles.modalOption} 
                    onPress={() => { setSortOption("Recientes"); setModalVisible(false); }}
                >
                    <Text style={styles.modalOptionText}>Recientes</Text>
                    {sortOption === "Recientes" && <Ionicons name="checkmark" size={24} color="#2196F3" />}
                </TouchableOpacity>
            </View>
         </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },

  // --- HEADER ---
  header: {
    backgroundColor: "#423646",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  headerTopRow: {
      flexDirection: 'row', alignItems: 'center', marginBottom: 15, justifyContent: 'space-between', marginTop: 19
  },
  headerTitle: {
      color: "#fff", fontSize: 20, fontWeight: "500", flex: 1
  },
  headerFollowButton: {
      backgroundColor: "#1976D2", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 5
  },
  headerFollowButtonBlue: {
      backgroundColor: "#2196F3", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8
  },
  headerFollowText: { color: "#fff", fontWeight: "bold" },
  
  searchBarContainer: { position: 'relative', justifyContent: 'center' },
  searchBar: {
    backgroundColor: "#F0F0F0", height: 40, borderRadius: 20, paddingLeft: 40, fontSize: 16
  },
  searchIcon: { position: 'absolute', left: 10 },

  // --- LANDING CONTENT ---
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#333" },
  recentItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  recentText: { marginLeft: 15, fontSize: 16, color: "#444" },
  
  tagItem: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  tagImage: { width: 40, height: 40, borderRadius: 5, marginRight: 15 },
  tagText: { fontSize: 16, fontWeight: "500" },

  // --- RESULTS CONTENT ---
  imageHeader: { height: 180, justifyContent: 'flex-end' },
  imageHeaderOverlay: { padding: 20 },
  imageHeaderTitle: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 10, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 5 },

  tabsContainer: {
      flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd'
  },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#423646' },
  tabText: { color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#423646' },

  subFilterContainer: {
      padding: 10, alignItems: 'flex-start' 
  },
  dropdownButton: {
      flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2196F3', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 15
  },
  dropdownText: { color: '#2196F3', marginRight: 5, fontWeight: 'bold' },

  // --- POST CARD ---
  postCard: { borderBottomWidth: 1, borderBottomColor: '#eee', padding: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postUser: { fontWeight: 'bold', fontSize: 15 },
  postTime: { color: '#888', fontSize: 12 },
  followButtonSmall: { marginLeft: 'auto' },
  followButtonTextSmall: { color: '#2196F3', fontWeight: 'bold' },
  postTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  postContent: { fontSize: 14, lineHeight: 20, color: '#333', marginBottom: 10 },
  postImage: { width: '100%', height: 300, borderRadius: 10, marginBottom: 10 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  postTag: { color: '#888', marginRight: 5 },
  
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  notesContainer: { borderWidth: 1, borderColor: '#555', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 4 },
  notesText: { fontSize: 12, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row' },
  actionIcon: { marginLeft: 15 },

  // --- PROFILE CARD ---
  profileCard: { marginBottom: 10, backgroundColor: '#eee' },
  bannerContainer: { height: 120, position: 'relative' },
  profileBanner: { width: '100%', height: '100%' },
  profileFollowBtn: { 
      position: 'absolute', right: 10, top: 10, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 
  },
  profileFollowText: { fontWeight: 'bold' },
  profileInfoContainer: { 
      flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#ccc' // Fondo gris perla como en la imagen
  },
  profileAvatarAbsolute: { 
      width: 70, height: 70, borderRadius: 5, marginTop: -35, borderWidth: 2, borderColor: '#fff' 
  },
  profileTexts: { marginLeft: 15, marginTop: 5 },
  profileName: { fontWeight: 'bold', fontSize: 16, color: '#fff', textShadowColor: '#000', textShadowRadius: 2 }, // Hack para que se lea sobre fondos oscuros o usar fondo solido
  profileHandle: { color: '#eee', fontSize: 13 },

  // --- FAB ---
  fab: {
      position: 'absolute', bottom: 20, right: 20, backgroundColor: '#2196F3', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5
  },

  // --- MODAL ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#ccc', alignSelf: 'center', borderRadius: 2, marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 },
  modalOptionText: { fontSize: 16 },
  modalSeparator: { height: 1, backgroundColor: '#eee' },
});

export default SearchScreen;