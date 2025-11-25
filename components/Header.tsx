import { useRouter } from "expo-router";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";
import { Colors, THEME } from "@/constants";

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

const INDICATOR_WIDTH = 50;
const INDICATOR_HEIGHT = 4;

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
      activeLayout.x + activeLayout.width / 100 - INDICATOR_WIDTH / 1.195;

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
    router.push("/screens/ProfileUserScreen");
  };

  const handleTabPress = (index: number) => {
    onTabChange(index);
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
              onPress={() => handleTabPress(index)}
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
  height: ${THEME.SPACING.HEADER_HEIGHT}px;
  background-color: ${Colors.primary};
  justify-content: flex-end;
  padding-bottom: ${THEME.SPACING.SM}px;
  padding-top: ${THEME.SPACING.STATUS_BAR}px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-horizontal: ${THEME.SPACING.SCREEN_HORIZONTAL}px;
`;

const LogoContainer = styled.View`
  flex: 1;
  align-items: flex-start;
  margin-top: -${THEME.SPACING.SM}px;
`;

const Logo = styled.Image`
  width: 50px;
  height: 50px;
  resize-mode: contain;
`;

const TabsContainer = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: ${THEME.SPACING.XS}px;
`;

const Tab = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  align-items: center;
  padding-vertical: ${THEME.SPACING.XS}px;
`;

const TabText = styled.Text<{ active: boolean }>`
  font-family: ${THEME.FONTS.BOLD};
  font-size: ${THEME.TYPOGRAPHY.SUBTITLE}px;
  color: ${({ active }) =>
    active ? Colors.textLight : Colors.textPlaceholder};
  margin-bottom: ${THEME.SPACING.XS}px;
`;

const TabIndicator = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  height: ${INDICATOR_HEIGHT}px;
  width: ${INDICATOR_WIDTH}px;
  background-color: ${Colors.secondary};
  border-radius: ${INDICATOR_HEIGHT / 2}px;
`;

const AvatarContainer = styled.View`
  flex: 1;
  align-items: flex-end;
  margin-top: -${THEME.SPACING.SM}px;
`;

const AvatarButton = styled.TouchableOpacity``;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  resize-mode: cover;
`;
