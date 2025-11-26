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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./HomeScreen";

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

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");

  const recentSearches: IRecentSearch[] = [
    { id: "1", text: "Sineala" },
    { id: "2", text: "Ao3" },
    { id: "3", text: "Fanfiction" },
  ];

  const followedTags: ITagItem[] = [
    {
      id: "1",
      text: "#destiel",
      imageUrl: "https://placehold.co/100x100/333/white?text=DS",
    },
    {
      id: "2",
      text: "#flowers",
      imageUrl: "https://placehold.co/100x100/pink/white?text=FL",
    },
    {
      id: "3",
      text: "#remmick",
      imageUrl: "https://placehold.co/100x100/222/white?text=RM",
    },
    {
      id: "4",
      text: "#sentryagent",
      imageUrl: "https://placehold.co/100x100/gold/black?text=SA",
    },
  ];

  // Manejadores de eventos
  const handleRemoveRecent = (id: string) => {
    console.log("Eliminar búsqueda:", id);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleViewAllTags = () => {
    router.push("/screens/ManageTagsScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME.COLORS.primary}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => router.replace("../screens/HomeScreen")}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={28}
                color={THEME.COLORS.textLight}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Explorar</Text>
          </View>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor={THEME.COLORS.textPlaceholder}
              value={searchText}
              onChangeText={handleSearch}
            />
            <Ionicons
              name="search"
              size={20}
              color={THEME.COLORS.textMuted}
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
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={THEME.COLORS.text}
                  />
                  <Text style={styles.recentItemText}>{item.text}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveRecent(item.id)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={THEME.COLORS.textMuted}
                  />
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
            onPress={handleViewAllTags}
          >
            <Text style={styles.viewAllText}>Ver las etiquetas que sigues</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={THEME.COLORS.text}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.background,
  },
  /* Header Styles */
  headerContainer: {
    backgroundColor: THEME.COLORS.primary,
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL,
    paddingBottom: THEME.SPACING.LG,
    paddingTop: THEME.SPACING.SM,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.SPACING.MD,
  },
  backButton: {
    marginRight: THEME.SPACING.MD,
  },
  headerTitle: {
    fontFamily: THEME.FONTS.TITLE_SERIF,
    fontSize: THEME.TYPOGRAPHY.TITLE,
    color: THEME.COLORS.textLight,
    fontWeight: "600",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.COLORS.background,
    borderRadius: THEME.COMMON.BORDER_RADIUS.LG,
    height: 45,
    paddingHorizontal: THEME.SPACING.MD,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontFamily: THEME.FONTS.REGULAR,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: THEME.COLORS.text,
  },
  searchIcon: {
    marginLeft: THEME.SPACING.XS,
  },
  scrollContent: {
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL,
    paddingTop: THEME.SPACING.LG,
    paddingBottom: THEME.SPACING.XL,
  },
  section: {
    marginBottom: THEME.SPACING.XL,
  },
  sectionTitle: {
    fontFamily: THEME.FONTS.BOLD,
    fontSize: THEME.TYPOGRAPHY.SUBTITLE,
    color: THEME.COLORS.text,
    marginBottom: THEME.SPACING.MD,
  },
  recentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.XS,
  },
  recentItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentItemText: {
    marginLeft: THEME.SPACING.MD,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: THEME.COLORS.text,
    fontFamily: THEME.FONTS.REGULAR,
  },
  tagItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.XS,
  },
  tagImage: {
    width: 40,
    height: 40,
    borderRadius: THEME.COMMON.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.backgroundAlt,
  },
  tagItemText: {
    marginLeft: THEME.SPACING.MD,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: THEME.COLORS.text,
    fontFamily: THEME.FONTS.REGULAR,
  },
  viewAllLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: THEME.SPACING.SM,
    paddingVertical: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.XS,
  },
  viewAllText: {
    fontFamily: THEME.FONTS.SEMI_BOLD,
    fontSize: THEME.TYPOGRAPHY.BODY,
    color: THEME.COLORS.text,
  },
});

export default SearchScreen;
