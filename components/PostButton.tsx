import React from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

const postButtonIcon = require("../../assets/images/post_button.png");

interface PostButtonProps {
  onPress?: () => void;
  navigateTo?: string;
  style?: any;
}

export const PostButton = ({
  onPress,
  navigateTo = "/screens/create-post",
  style
}: PostButtonProps) => {
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
      <ButtonImage source={postButtonIcon} />
    </ButtonContainer>
  );
};

// Styled Components
const ButtonContainer = styled.TouchableOpacity`
  width: 54px;
  height: 54px;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ButtonImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;
