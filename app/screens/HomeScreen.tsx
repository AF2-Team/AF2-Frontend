import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Feed } from "../../components/Feed";
import { FloatingActionButton } from "../../components/FloatingActionButton";
import { Header } from "../../components/Header";
import { NavigationBar } from "../../components/NavigationBar";
import { TagsFeed } from "../../components/TagsFeed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, THEME } from "../../constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const userData = {
  avatarUrl: undefined,
  username: "usuario123",
};

export default function HomeScreen() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const insets = useSafeAreaInsets();

  const handleHeaderTabChange = (index: number) => {
    setActiveTabIndex(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e: any) => {
    setActiveTabIndex(e.nativeEvent.position);
  };

  return (
    <View style={styles.fullContainer}>
      {/* Header en posición absoluta arriba del todo */}
      <View style={[styles.headerContainer, { top: insets.top }]}>
        <Header
          currentUser={userData}
          activeTabIndex={activeTabIndex}
          onTabChange={handleHeaderTabChange}
        />
      </View>

      {/* Contenido principal con padding top para el Header */}
      <View
        style={[
          styles.mainContent,
          { paddingTop: THEME.SPACING.HEADER_HEIGHT + insets.top },
        ]}
      >
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={handlePageSelected}
        >
          <View key="1">
            <Feed />
          </View>
          <View key="2">
            <TagsFeed />
          </View>
        </PagerView>

        <FloatingActionButton style={styles.floatingButton} />
      </View>

      {/* Área inferior completa con NavigationBar + espacio de gestos */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom }]}>
        <NavigationBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: Colors.tabBarBackground,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    backgroundColor: Colors.background,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pagerView: {
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: THEME.SPACING.XL,
    right: THEME.SPACING.MD,
    zIndex: 12,
  },
  bottomArea: {
    backgroundColor: Colors.tabBarBackground,
    width: "100%",
  },
});
