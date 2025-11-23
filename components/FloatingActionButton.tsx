import React from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const COLOR_PRIMARY = "#1291EB";
const COLOR_LIGHT_TEXT = "#faf7f7";
const BUTTON_SIZE = 54;
const ICON_SIZE = 28;

interface FloatingActionButtonProps {
  onPress?: () => void;
  navigateTo?: string;
  style?: any;
}

export const FloatingActionButton = ({
  onPress,
  navigateTo = "/screens/create-post",
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
      <Ionicons name="create" size={ICON_SIZE} color={COLOR_LIGHT_TEXT} />
    </ButtonContainer>
  );
};

const ButtonContainer = styled.TouchableOpacity`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: ${BUTTON_SIZE / 2}px;
  background-color: ${COLOR_PRIMARY};
  justify-content: center;
  align-items: center;
  z-index: 1000;

  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;
