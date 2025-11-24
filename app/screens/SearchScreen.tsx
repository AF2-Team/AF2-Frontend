import { THEME } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Interfaces para los datos mockeados
interface IRecentSearch {
  id: string;
  text: string;
}

interface ITagItem {
  id: string;
  text: string;
  imageUrl: string;
}

const ExploreScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");

  // Datos de ejemplo basados en tu imagen
  const recentSearches: IRecentSearch[] = [
    { id: "1", text: "Sineala" },
    { id: "2", text: "Ao3" },
    { id: "3", text: "Fanfiction" },
  ];

  const followedTags: ITagItem[] = [
    { id: "1", text: "#destiel", imageUrl: "https://placehold.co/100x100/333/white?text=DS" },
    { id: "2", text: "#flowers", imageUrl: "https://placehold.co/100x100/pink/white?text=FL" },
    { id: "3", text: "#remmick", imageUrl: "https://placehold.co/100x100/222/white?text=RM" },
    { id: "4", text: "#sentryagent", imageUrl: "https://placehold.co/100x100/gold/black?text=SA" },
  ];

  // Manejadores de eventos (placeholders)
  const handleRemoveRecent = (id: string) => {
    console.log("Eliminar búsqueda:", id);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={"red"} />      
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Explorar</Text>
          </View>
          <View style={styles.searchBarContainer}>
            <Text></Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor={THEME.COLORS.textPlaceholder || "#999"}
              value={searchText}
              onChangeText={handleSearch}
            />
            <Ionicons 
              name="search" 
              size={20} 
              color={THEME.COLORS.textMuted || "#666"} 
              style={styles.searchIcon}
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recientes</Text>
            
            {recentSearches.map((item) => (
              <View key={item.id} style={styles.recentItemRow}>
                <View style={styles.recentItemLeft}>
                  <Ionicons name="search-outline" size={24} color={THEME.COLORS.text || "#333"} />
                  <Text style={styles.recentItemText}>{item.text}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveRecent(item.id)}>
                  <Ionicons name="close" size={24} color={THEME.COLORS.textMuted || "#666"} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Etiquetas que sigues</Text>
            {followedTags.map((item) => (
              <View key={item.id} style={styles.tagItemRow}>
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={styles.tagImage} 
                />
                <Text style={styles.tagItemText}>{item.text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewAllLinkContainer}
            onPress={() => (null/*router.push("/screens/FandomScreen")*/)}
          >
            <Text style={styles.viewAllText}>Ver las etiquetas que sigues</Text>
            <Ionicons name="arrow-forward" size={20} color={THEME.COLORS.text || "#333"} />
          </TouchableOpacity>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#46364B",
  },
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.background || "#FFF",
  },
  /* Header Styles */
  headerContainer: {
    backgroundColor: "#46364B",
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL || 16,
    paddingBottom: THEME.SPACING.LG || 20,
    paddingTop: THEME.SPACING.SM || 10,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.SPACING.MD || 16,
  },
  backButton: {
    marginRight: THEME.SPACING.MD || 16,
  },
  headerTitle: {
    fontFamily: THEME.FONTS.TITLE_SERIF || "System",
    fontSize: THEME.TYPOGRAPHY.TITLE || 22,
    color: "white",
    fontWeight: "600",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    height: 45,
    paddingHorizontal: THEME.SPACING.MD || 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: THEME.FONTS.REGULAR || "System",
    fontSize: THEME.TYPOGRAPHY.BODY || 16,
    color: THEME.COLORS.text || "#000",
  },
  searchIcon: {
    marginLeft: 8,
    position: "absolute",
    right: 16,
    color: "#666"
  },
  scrollContent: {
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL || 20,
    paddingTop: THEME.SPACING.LG || 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: THEME.SPACING.XL || 32,
  },
  sectionTitle: {
    fontFamily: THEME.FONTS.BOLD || "System",
    fontSize: THEME.TYPOGRAPHY.HEADER || 18,
    color: THEME.COLORS.text || "#333",
    marginBottom: THEME.SPACING.MD || 16,
    fontWeight: "bold",
    opacity: 0.8,
  },
  recentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: THEME.SPACING.MD || 16,
  },
  recentItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentItemText: {
    marginLeft: THEME.SPACING.MD || 16,
    fontSize: THEME.TYPOGRAPHY.BODY || 16,
    color: THEME.COLORS.textMuted || "#555",
    fontFamily: THEME.FONTS.REGULAR || "System",
  },
  tagItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.SPACING.MD || 16,
  },
  tagImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  tagItemText: {
    marginLeft: THEME.SPACING.MD || 16,
    fontSize: THEME.TYPOGRAPHY.BODY || 16,
    color: THEME.COLORS.text || "#333",
    fontFamily: THEME.FONTS.REGULAR || "System",
  },
  viewAllLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: THEME.SPACING.SM || 8,
    paddingVertical: 10,
  },
  viewAllText: {
    fontFamily: THEME.FONTS.BOLD || "System",
    fontSize: 16,
    color: THEME.COLORS.text || "#000",
    fontWeight: "600",
  }
});

export default ExploreScreen;