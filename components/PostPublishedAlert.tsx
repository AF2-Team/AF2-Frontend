import React, { useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("window");

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

  const OUT_OF_VIEW_OFFSET = screenHeight * 0.15;

  useEffect(() => {
    if (visible) {
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

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: OUT_OF_VIEW_OFFSET,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          slideAnim.setValue(screenHeight);
          onHide?.();
        });
      }, 2500);

      return () => {
        clearTimeout(timer);
        slideAnim.stopAnimation();
        opacityAnim.stopAnimation();
      };
    } else {
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
        {/* Reemplazado el Image component por Ionicons */}
        <IconContainer>
          <Ionicons name="checkmark-circle" size={20} color="#1291eb" />
        </IconContainer>
        <MessageText>Publicado en {username}</MessageText>
      </AlertBox>
    </AnimatedContainer>
  );
};

const AnimatedContainer = styled(Animated.View)`
  position: absolute;
  bottom: 120px;
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

const IconContainer = styled.View`
  margin-right: 8px;
`;

const MessageText = styled.Text`
  color: #1291eb;
  font-size: 14px;
  font-weight: 600;
`;
