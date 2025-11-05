import React, { useState, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { Header } from "../../components/Header";
import { FloatingActionButton } from "../../components/FloatingActionButton";
import { NavigationBar } from "../../components/NavigationBar";
import { Feed } from "../../components/Feed";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const NAV_BAR_WIDTH = 180;
const NAV_BAR_HEIGHT = 87;

const userData = {
  avatarUrl: undefined,
  username: "usuario123",
};

export const HomeScreen = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleHeaderTabChange = (index: number) => {
    setActiveTabIndex(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e: any) => {
    setActiveTabIndex(e.nativeEvent.position);
  };

  return (
    <View style={styles.container}>
      <Header
        currentUser={userData}
        activeTabIndex={activeTabIndex}
        onTabChange={handleHeaderTabChange}
      />

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
          <View style={styles.placeholder}>
            {/* TagsFeed iría aquí en el futuro */}
          </View>
        </View>
      </PagerView>

      <FloatingActionButton style={styles.floatingButton} />
      <NavigationBar style={styles.navigationBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  pagerView: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 12,
  },
  navigationBar: {
    position: "absolute",
    bottom: 20,
    left: (screenWidth - NAV_BAR_WIDTH) / 2,
    zIndex: 11,
  },
});
