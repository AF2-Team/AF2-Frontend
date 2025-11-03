import React from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const postButtonIcon = require('../../assets/images/post_button.png'); 

interface PostButtonProps {
  onPress?: () => void;
  navigateTo?: string;
}

export const PostButton = ({ 
  onPress, 
  navigateTo = '/screens/create-post' 
}: PostButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Uso de rutas absolutas para mayor robustez
      router.push(navigateTo as any); 
    }
  };

  return (
    <ButtonContainer onPress={handlePress} activeOpacity={0.8}>
      <ButtonImage source={postButtonIcon} />
    </ButtonContainer>
  );
};

// Styled Components
const ButtonContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 54px;
  height: 54px;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4); 
  elevation: 6;
`;

const ButtonImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;
