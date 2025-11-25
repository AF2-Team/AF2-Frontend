import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

const { width: screenWidth } = Dimensions.get("window");

export interface Tab {
  key: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  count?: number;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: number;
  onTabPress: (index: number) => void;
  onIndexChange: (index: number) => void;
  renderScene: (props: { index: number }) => React.ReactNode;
  activeColor?: string;
  inactiveColor?: string;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  activeTab,
  onTabPress,
  onIndexChange,
  renderScene,
  activeColor = Colors.primary,
  inactiveColor = Colors.textMuted,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleTabPress = (index: number) => {
    onTabPress(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const onMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    onIndexChange(index);
  };

  return (
    <View style={styles.container}>
      {/* Tab Indicators */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          const iconColor = isActive ? activeColor : inactiveColor;
          const countColor = isActive ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleTabPress(index)}
            >
              <View style={styles.tabContent}>
                <Ionicons name={tab.icon} size={25} color={iconColor} />
                {tab.count !== undefined && tab.count > 0 && (
                  <Text style={[styles.countText, { color: countColor }]}>
                    ({tab.count})
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={tabs}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ index }) => (
          <View style={{ width: screenWidth }}>{renderScene({ index })}</View>
        )}
        keyExtractor={(item) => item.key}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={18}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: THEME.SPACING.MD,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    marginLeft: THEME.SPACING.XS,
    fontSize: THEME.TYPOGRAPHY.BODY,
    fontFamily: THEME.FONTS.SEMI_BOLD,
  },
});
