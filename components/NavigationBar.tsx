import React, { useState } from "react";
import { useRouter, usePathname } from "expo-router";
import styled from "styled-components/native";
import { Dimensions, Pressable } from "react-native";

const homeIconOutline = require("../assets/images/homeIcon_outline.png");
const homeIconFilled = require("../assets/images/homeIcon_filled.png");
const searchIconOutline = require("../assets/images/searchIcon_outline.png");
const notificationIconOutline = require("../assets/images/notificationIcon_outline.png");
const notificationIconFilled = require("../assets/images/notificationIcon_filled.png");
const messagesIconOutline = require("../assets/images/messageIcon_outline.png");
const messagesIconFilled = require("../assets/images/messageIcon_filled.png");

const { width: screenWidth } = Dimensions.get("window");

interface NavigationBarProps {
  style?: any;
}

// Altura ajustada para el nuevo diseño flotante
const NAV_BAR_HEIGHT = 60; 

export const NavigationBar = ({ style }: NavigationBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

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
    <Container style={style}>
      <NavButton onPress={() => navigateTo("home")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <Icon source={getIconSource("home")} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>

      <NavButton onPress={() => navigateTo("search")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <Icon source={getIconSource("search")} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>

      <NavButton onPress={() => navigateTo("notifications")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <Icon source={getIconSource("notifications")} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>

      <NavButton onPress={() => navigateTo("messages")}>
        {({ pressed }) => (
          <ButtonContent pressed={pressed}>
            <Icon source={getIconSource("messages")} pressed={pressed} />
          </ButtonContent>
        )}
      </NavButton>
    </Container>
  );
};

// Styled Components - SOLO CAMBIO ESTA LÍNEA:
const Container = styled.View`
  width: 100%; /* ← CAMBIADO: De screenWidth * 0.9 a 100% */
  height: ${NAV_BAR_HEIGHT}px;
  background-color: #423646;
  border-radius: 0px; /* ← OPCIONAL: Si quieres esquinas cuadradas */
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

const ButtonContent = styled.View<{ pressed: boolean }>`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${({ pressed }) => 
    pressed ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  border-radius: 0px; /* ← OPCIONAL: Coherencia con diseño full-width */
`;

const Icon = styled.Image<{ pressed: boolean }>`
  width: 24px;
  height: 24px;
  resize-mode: contain;
  opacity: ${({ pressed }) => pressed ? 0.8 : 1};
`;
