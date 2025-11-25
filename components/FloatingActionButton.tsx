import React from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

interface FloatingActionButtonProps {
  onPress?: () => void;
  navigateTo?: string;
  style?: any;
}

export const FloatingActionButton = ({
  onPress,
  navigateTo = "/screens/CreatePostScreen",
  style,
}: FloatingActionButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(navigateTo);
    }
  };

  return (
    <ButtonContainer style={style} onPress={handlePress} activeOpacity={0.8}>
      <CenteredIcon name="create" size={ICON_SIZE} color={Colors.textLight} />
    </ButtonContainer>
  );
};

const BUTTON_SIZE = 60;
const ICON_SIZE = 28;

const ButtonContainer = styled.TouchableOpacity`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: ${BUTTON_SIZE / 2}px;
  background-color: ${Colors.action};
  justify-content: center;
  align-items: center;
  z-index: 1000;

  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const CenteredIcon = styled(Ionicons)`
  transform: translateX(0.5px) translateY(0.5px);
`;
