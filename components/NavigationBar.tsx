import { usePathname, useRouter } from "expo-router";
import React from "react";
import styled from "styled-components/native";
// Asegúrate de tener instalada esta librería: npx expo install react-native-safe-area-context
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

const homeIconOutline = require("../assets/images/homeIcon_outline.png");
const homeIconFilled = require("../assets/images/homeIcon_filled.png");
const searchIconOutline = require("../assets/images/searchIcon_outline.png");
const notificationIconOutline = require("../assets/images/notificationIcon_outline.png");
const notificationIconFilled = require("../assets/images/notificationIcon_filled.png");
const messagesIconOutline = require("../assets/images/messageIcon_outline.png");
const messagesIconFilled = require("../assets/images/messageIcon_filled.png");

interface NavigationBarProps {
  style?: any;
}

export const NavigationBar = ({ style }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  // Esto detecta si es un iPhone con 'notch' o barra inferior, o un Android moderno
  const insets = useSafeAreaInsets();

  const navigateTo = (screen: string) => {
    router.push(`/(tabs)/${screen}`);
  };

  const getIconSource = (screen: string) => {
    const isActive = pathname === `/(tabs)/${screen}`;

    switch (screen) {
      case "home":
        return isActive ? homeIconFilled : homeIconOutline;
      case "search":
        return searchIconOutline;
      case "notifications":
        return isActive ? notificationIconFilled : notificationIconOutline;
      case "messages":
        return isActive ? messagesIconFilled : messagesIconOutline;
      default:
        return homeIconOutline;
    }
  };

  return (
    // Pasamos los insets al styled component
    <Container style={style} insets={insets}>
      <NavButton onPress={() => navigateTo("home")}>
        <Icon source={getIconSource("home")} />
      </NavButton>

      <NavButton onPress={() => navigateTo("search")}>
        <Icon source={getIconSource("search")} />
      </NavButton>

      <NavButton onPress={() => navigateTo("notifications")}>
        <Icon source={getIconSource("notifications")} />
      </NavButton>

      <NavButton onPress={() => navigateTo("messages")}>
        <Icon source={getIconSource("messages")} />
      </NavButton>
    </Container>
  );
};

// --- ESTILOS CORREGIDOS ---

interface ContainerProps {
  insets: EdgeInsets;
}

const Container = styled.View<ContainerProps>`
  /* 1. ANCHO TOTAL: Esto es lo más importante para arreglar tu problema */
  width: 100%; 
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  /* 2. ESTILO VISUAL */
  background-color: #423646;
  /* Quitamos el border-radius para que sea una barra plana */
  border-radius: 0px; 
  
  /* 3. ALINEACIÓN */
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  /* 4. ALTURA DINÁMICA (Se adapta si el celular tiene botones virtuales o barra swipe) */
  padding-bottom: ${(props) => props.insets.bottom}px;
  height: ${(props) => 60 + props.insets.bottom}px;

  /* 5. SOMBRA */
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const NavButton = styled.TouchableOpacity`
  /* Área de toque grande para facilitar el uso */
  flex: 1; 
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: transparent; 
`;

const Icon = styled.Image`
  width: 26px;
  height: 26px;
  resize-mode: contain;
`;