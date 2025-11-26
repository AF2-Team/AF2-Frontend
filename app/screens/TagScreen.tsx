import { THEME } from "@/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IRelatedTag {
  id: string;
  tagName: string;
  images: string[];
  backgroundColor: string;
}

const TagScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("Etiquetas");

  const relatedTags: IRelatedTag[] = [
    {
      id: "1",
      tagName: "#SPN",
      backgroundColor: "#4A0E0E",
      images: [
        "https://placehold.co/150x150/5E2A2A/FFF?text=SPN1",
        "https://placehold.co/150x150/8C4A4A/FFF?text=SPN2",
      ],
    },
    {
      id: "2",
      tagName: "#Stony",
      backgroundColor: "#2E5E38",
      images: [
        "https://placehold.co/150x150/4A7A56/FFF?text=Stony1",
        "https://placehold.co/150x150/6B9C78/FFF?text=Stony2",
      ],
    },
    {
      id: "3",
      tagName: "#fanfiction",
      backgroundColor: "#A67B76",
      images: [
        "https://placehold.co/150x150/C49894/FFF?text=Fan1",
        "https://placehold.co/150x150/DAB6B2/FFF?text=Fan2",
      ],
    },
    {
      id: "4",
      tagName: "#fan",
      backgroundColor: "#2D2B55",
      images: [
        "https://placehold.co/150x150/45427D/FFF?text=FanA",
        "https://placehold.co/150x150/5D5AA8/FFF?text=FanB",
      ],
    },
    {
      id: "5",
      tagName: "#gardenverse",
      backgroundColor: "#C62808",
      images: [
        "https://placehold.co/150x150/E05A42/FFF?text=G1",
        "https://placehold.co/150x150/F28472/FFF?text=G2",
      ],
    },
    {
      id: "6",
      tagName: "#AU",
      backgroundColor: "#4F6D7A",
      images: [
        "https://placehold.co/150x150/6F8E9C/FFF?text=AU1",
        "https://placehold.co/150x150/92B0BE/FFF?text=AU2",
      ],
    },
  ];

  const popularTagImage = "https://placehold.co/600x200/222/FFF?text=Cover";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#46364B" />
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>fandom</Text>          
          <TouchableOpacity style={styles.followButtonHeader}>
            <Text style={styles.followButtonHeaderText}>Seguir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabsContainer}>
          {["Publicaciones", "Etiquetas", "Perfiles"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                activeTab === tab && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Etiqueta popular</Text>
          <View style={styles.popularBannerContainer}>
            <Image
              source={{ uri: popularTagImage }}
              style={styles.popularBannerImage}
              resizeMode="cover"
            />
            <View style={styles.popularBannerOverlay} />
            <Text style={styles.popularBannerText}>#fandom</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Etiquetas relacionas</Text>
          <View style={styles.gridContainer}>
            {relatedTags.map((item) => (
              <View
                key={item.id}
                style={[styles.card, { backgroundColor: item.backgroundColor }]}
              >
                <Text style={styles.cardTitle}>{item.tagName}</Text>
                <View style={styles.cardImagesRow}>
                  <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
                  <Image source={{ uri: item.images[1] }} style={styles.cardImage} />
                </View>
                <TouchableOpacity style={styles.cardFollowButton}>
                  <Text style={styles.cardFollowButtonText}>Seguir</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="pencil" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (THEME.SPACING.SCREEN_HORIZONTAL || 16) * 2 - CARD_MARGIN) / 2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#46364B",
  },
  headerContainer: {
    backgroundColor: "#46364B",
    paddingTop: THEME.SPACING.SM || 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL || 16,
    paddingBottom: THEME.SPACING.MD || 16,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    fontFamily: THEME.FONTS.BOLD || "System",
  },
  followButtonHeader: {
    backgroundColor: "#1E88E5",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  followButtonHeaderText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#3E3042",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: "#1E88E5",
  },
  tabText: {
    color: "#AAA",
    fontSize: 15,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#1E88E5",
    fontWeight: "bold",
  },
  scrollContent: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: THEME.SPACING.SCREEN_HORIZONTAL || 16,
    paddingTop: THEME.SPACING.LG || 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: THEME.SPACING.XL || 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: THEME.SPACING.MD || 12,
    fontFamily: THEME.FONTS.BOLD || "System",
  },
  popularBannerContainer: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  popularBannerImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  popularBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  popularBannerText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    zIndex: 1,
    fontFamily: THEME.FONTS.BOLD || "System",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  cardImagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  cardImage: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  cardFollowButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  cardFollowButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E88E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default TagScreen;