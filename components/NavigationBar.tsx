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
}
interface INavIcon {
  icon: IoniconsName; 
  pressed: boolean;
  isActive: boolean;
}
const routes: Route[] = [
  { path: "/screens/HomeScreen", icon: (isActive) => isActive ? "home" : "home-outline" },
  { path: "/screens/Search", icon: (isActive) => isActive ? "search" : "search-outline" },
  //{ path: "/screens/Notifications", icon: (isActive) => isActive ? "notifications" : "notifications-outline" },
  //{ path: "/screens/Messages", icon: (isActive) => isActive ? "chatbubble" : "chatbubble-outline" }
];
// Altura fija de la barra
const NAV_BAR_HEIGHT = 60;

const NavIcon = ({ icon, pressed, isActive }: INavIcon) => {
  const iconColor = isActive ? "#FFFFFF" : "#D1D5DB";
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
      {routes.map(({ path, icon }) => {
        const isActive = pathname === `/(tabs)/${path}`;
        
        return (
          <Pressable 
            key={String(path)}
            onPress={() => router.navigate(path)}
          >
            {({ pressed }) => (
              <View style={[
                styles.buttonContent,
                pressed && styles.buttonContentPressed
              ]}>
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

// Styled Components
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: NAV_BAR_HEIGHT,
    backgroundColor: "#423646",
    borderRadius: "0px",
    gap: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'flex-start',
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: 0,
  },
  buttonContentPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  }
});