import React from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const logo = require("../assets/images/logo.png");
const defaultAvatar = require("../assets/images/default_avatar.png");

interface HeaderProps {
  currentUser?: {
    avatarUrl?: string;
    username?: string;
  };
  activeTabIndex: number;
  onTabChange: (index: number) => void;
}

const INDICATOR_WIDTH = 26.95;
const INDICATOR_HEIGHT = 2.82;

export const Header = ({
  currentUser,
  activeTabIndex,
  onTabChange,
}: HeaderProps) => {
  const router = useRouter();
  const indicatorPosition = useSharedValue(0);

  const tabLayouts = React.useRef([
    { width: 0, x: 0 },
    { width: 0, x: 0 },
  ]);

  const tabs = ["Inicio", "Etiquetas"];

  const handleLayout = (event: any, index: number) => {
    const { width, x } = event.nativeEvent.layout;
    tabLayouts.current[index] = { width, x };

    if (index === activeTabIndex) {
      updateIndicatorPosition(index);
    }
  };

  const updateIndicatorPosition = (index: number) => {
    const activeLayout = tabLayouts.current[index];

    if (activeLayout.width === 0) return;

    const newPosition =
      activeLayout.x + activeLayout.width / 2 - INDICATOR_WIDTH / 2;

    indicatorPosition.value = withTiming(newPosition, {
      duration: 200,
    });
  };

  React.useEffect(() => {
    updateIndicatorPosition(activeTabIndex);
  }, [activeTabIndex]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    };
  });

  const handleProfilePress = () => {
    router.push("/screens/profile");
  };

  const handleTabPress = (tab: "inicio" | "etiquetas") => {
    onTabChange(tab === "inicio" ? 0 : 1);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Logo source={logo} />
        </LogoContainer>

        <TabsContainer>
          {tabs.map((tab, index) => (
            <Tab
              key={tab}
              onLayout={(event) => handleLayout(event, index)}
              active={activeTabIndex === index}
              onPress={() =>
                handleTabPress(index === 0 ? "inicio" : "etiquetas")
              }
            >
              <TabText active={activeTabIndex === index}>{tab}</TabText>
            </Tab>
          ))}
          <TabIndicator style={indicatorStyle} />
        </TabsContainer>

        <AvatarContainer>
          <AvatarButton onPress={handleProfilePress}>
            <Avatar
              source={
                currentUser?.avatarUrl
                  ? { uri: currentUser.avatarUrl }
                  : defaultAvatar
              }
            />
          </AvatarButton>
        </AvatarContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View`
  width: 100%;
  height: 181px;
  background-color: #423646;
  justify-content: flex-end;
  padding-bottom: 20px;
  padding-top: 50px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 15px;
`;

const LogoContainer = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const Logo = styled.Image`
  width: 40px;
  height: 40px;
  resize-mode: contain;
`;

const TabsContainer = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  align-items: center;
  padding-vertical: 8px;
`;

const TabText = styled.Text<{ active: boolean }>`
  font-family: "OpenSans-Bold";
  font-size: 16px;
  color: ${({ active }) => (active ? "#FFFFFF" : "#ADADAD")};
  margin-bottom: 8px;
`;

const TabIndicator = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  height: ${INDICATOR_HEIGHT}px;
  width: ${INDICATOR_WIDTH}px;
  background-color: #bca1bd;
  border-radius: ${INDICATOR_HEIGHT / 2}px;
`;

const AvatarContainer = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const AvatarButton = styled.TouchableOpacity``;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  resize-mode: cover;
`;
