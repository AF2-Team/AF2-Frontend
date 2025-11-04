import React from "react";
import { useRouter, usePathname } from "expo-router";
import styled from "styled-components/native";

// Importar los íconos en sus versiones outline y filled
const homeIconOutline = require("../assets/images/homeIcon_outline.png");
const homeIconFilled = require("../assets/images/homeIcon_filled.png");
const searchIconOutline = require("../assets/images/searchIcon_outline.png");
const notificationIconOutline = require("../assets/images/notificationIcon_outline.png");
const notificationIconFilled = require("../assets/images/notificationIcon_filled.png");
const messagesIconOutline = require("../assets/images/messagesIcon_outline.png");
const messagesIconFilled = require("../assets/images/messagesIcon_filled.png");

interface NavigationBarProps {
  style?: any;
}

export const NavigationBar = ({ style }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (screen: string) => {
    router.push(`/screens/${screen}`);
  };

  const getIconSource = (screen: string) => {
    const isActive = pathname === `/screens/${screen}`;

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
    <Container style={style}>
      {" "}
      {/* Aplicar estilos adicionales */}
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

// Styled Components
const Container = styled.View`
  width: 142px;
  height: 87px;
  background-color: #423646;
  border-radius: 12px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-horizontal: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const NavButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
  resize-mode: contain;
`;
