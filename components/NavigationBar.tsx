import React from "react";
import { useRouter, usePathname } from "expo-router";
import styled from "styled-components/native";
import { Dimensions } from "react-native";

const homeIconOutline = require("../images/homeIcon_outline.png");
const homeIconFilled = require("../images/homeIcon_filled.png");
const searchIconOutline = require("../images/searchIcon_outline.png");
const notificationIconOutline = require("../images/notificationIcon_outline.png");
const notificationIconFilled = require("../images/notificationIcon_filled.png");
const messagesIconOutline = require("../images/messagesIcon_outline.png");
const messagesIconFilled = require("../images/messagesIcon_filled.png");

const { width: screenWidth } = Dimensions.get("window");

interface NavigationBarProps {
  style?: any;
}

const NAV_BAR_WIDTH = 180;
const NAV_BAR_HEIGHT = 87;

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

const Container = styled.View`
  width: ${NAV_BAR_WIDTH}px;
  height: ${NAV_BAR_HEIGHT}px;
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
