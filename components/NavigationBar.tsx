import React from "react";
import { useRouter, usePathname } from "expo-router";
import styled from "styled-components/native";
import { Dimensions, Pressable } from "react-native";
// Importamos los íconos vectoriales de Expo
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

interface NavigationBarProps {
  style?: any;
}

// Altura fija de la barra
const NAV_BAR_HEIGHT = 60;

export const NavigationBar = ({ style }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Función para manejar la navegación entre pestañas
  const navigateTo = (screen: string) => {
    router.push(`/(tabs)/${screen}`);
  };

  // Componente interno para renderizar el ícono y su estado (activo/inactivo)
  const NavIcon = ({ screen, pressed }) => {
    // Comprobamos si la ruta actual coincide con la pantalla
    const isActive = pathname === `/(tabs)/${screen}`;

    // El color activo es blanco, el inactivo es un gris claro para contrastar con el fondo oscuro
    const iconColor = isActive ? "#FFFFFF" : "#D1D5DB";

    let IconComponent;
    let iconName;

    switch (screen) {
      case "home":
        // Ionicons: home (relleno) / home-outline (contorno)
        iconName = isActive ? "home" : "home-outline";
        IconComponent = Ionicons;
        break;
      case "search":
        // Ionicons: Mantenemos el icono de búsqueda siempre en contorno
        iconName = "search-outline";
        IconComponent = Ionicons;
        break;
      case "notifications":
        // Ionicons: bell (relleno) / bell-outline (contorno)
        iconName = isActive ? "bell" : "bell-outline";
        IconComponent = Ionicons;
        break;
      case "messages":
        // MaterialCommunityIcons: email (relleno) / email-outline (contorno)
        iconName = isActive ? "email" : "email-outline";
        IconComponent = MaterialCommunityIcons;
        break;
      default:
        iconName = "home-outline";
        IconComponent = Ionicons;
        break;
    }

    // El estado pressed (al presionar) reduce ligeramente la opacidad
    const iconOpacity = pressed ? 0.8 : 1;

    return (
      <IconComponent
        name={iconName}
        size={24}
        color={iconColor}
        style={{ opacity: iconOpacity }}
      />
    );
  };

  return (
    <Container style={style}>
      <NavButton onPress={() => navigateTo("home")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <NavIcon screen={"home"} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>

      <NavButton onPress={() => navigateTo("search")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <NavIcon screen={"search"} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>

      <NavButton onPress={() => navigateTo("notifications")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <NavIcon screen={"notifications"} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>

      <NavButton onPress={() => navigateTo("messages")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <NavIcon screen={"messages"} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  /* Configuración de ancho completo y color */
  width: 100%;
  height: ${NAV_BAR_HEIGHT}px;
  background-color: #423646;
  border-radius: 0px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-horizontal: 0px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const NavButton = styled.Pressable`
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: 0px;
`;

// Estilo para el efecto visual al presionar
const ButtonContent = styled.View<{ pressed: boolean }>`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${({ pressed }) =>
    pressed ? "rgba(255, 255, 255, 0.15)" : "transparent"};
  border-radius: 0px;
`;
