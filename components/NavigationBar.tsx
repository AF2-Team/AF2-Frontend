import { Colors, THEME } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface NavigationBarProps {
  style?: any;
}

interface Route {
  path: Href;
  icon: (isActive: boolean) => IoniconsName;
  label: string;
}

interface INavIcon {
  icon: IoniconsName;
  pressed: boolean;
  isActive: boolean;
}

const routes: Route[] = [
  {
    path: "/screens/HomeScreen",
    icon: (isActive) => (isActive ? "home" : "home-outline"),
    label: "Home",
  },
  {
    path: "/screens/SearchScreen",
    icon: (isActive) => (isActive ? "search" : "search-outline"),
    label: "Search",
  },
  {
    path: "/screens/NotificationScreen",
    icon: (isActive) => (isActive ? "notifications" : "notifications-outline"),
    label: "Notifications",
  },
  {
    path: "/screens/MessageListScreen",
    icon: (isActive) => (isActive ? "chatbubble" : "chatbubble-outline"),
    label: "Messages",
  },
];

const NavIcon = ({ icon, pressed, isActive }: INavIcon) => {
  const iconColor = isActive ? Colors.tabIconSelected : Colors.navIconInactive;
  const iconOpacity = pressed ? 0.8 : 1;

  return (
    <Ionicons
      name={icon}
      size={24}
      color={iconColor}
      style={{ opacity: iconOpacity }}
    />
  );
};

export const NavigationBar = ({ style }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.container, style]}>
      {routes.map(({ path, icon, label }) => {
        const isActive =
          pathname === path || pathname.startsWith(path as string);

        return (
          <Pressable
            key={String(path)}
            onPress={() => router.push(path)}
            style={styles.pressable}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.buttonContent,
                  isActive && styles.buttonContentActive,
                  pressed && styles.buttonContentPressed,
                ]}
              >
                <NavIcon
                  icon={icon(isActive)}
                  pressed={pressed}
                  isActive={isActive}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: THEME.SPACING.NAV_BAR_HEIGHT,
    backgroundColor: Colors.tabBarBackground,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: THEME.SPACING.SM,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
  },
  buttonContent: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    width: 44,
    borderRadius: THEME.COMMON.BORDER_RADIUS.FULL,
    backgroundColor: Colors.transparent,
  },
  buttonContentActive: {
    backgroundColor: Colors.pressedOverlay,
  },
  buttonContentPressed: {
    backgroundColor: Colors.pressedOverlay,
  },
});
