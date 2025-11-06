import React, { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import styled from "styled-components/native";

const { height: screenHeight } = Dimensions.get("window");
const checkIcon = require("../assets/images/check-icon.png");

interface PostPublishedAlertProps {
  visible: boolean;
  username: string;
  onHide?: () => void;
}

export const PostPublishedAlert: React.FC<PostPublishedAlertProps> = ({
  visible,
  username,
  onHide,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animar aparición
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Ocultar automáticamente tras 2.5 segundos
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: screenHeight * 0.15,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, 2500);

      return () => {
        clearTimeout(timer);
        // Limpiar animaciones si el componente se desmonta
        slideAnim.stopAnimation();
        opacityAnim.stopAnimation();
      };
    } else {
      // Resetear animaciones cuando no es visible
      slideAnim.setValue(screenHeight);
      opacityAnim.setValue(0);
    }
  }, [visible, slideAnim, opacityAnim, onHide]);

  if (!visible) return null;

  return (
    <AnimatedContainer
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <AlertBox>
        <Icon source={checkIcon} />
        <MessageText>Publicado en {username}</MessageText>
      </AlertBox>
    </AnimatedContainer>
  );
};

// Estilos
const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: 120px; /* Posición ajustada sobre la NavigationBar */
  align-self: center;
  z-index: 1000;
`;

const AlertBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #e0f2ff;
  border: 1.5px solid #1291eb;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 250px;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const MessageText = styled.Text`
  color: #1291eb;
  font-size: 14px;
  font-weight: 600;
  font-family: OpenSans-SemiBold;
`;
