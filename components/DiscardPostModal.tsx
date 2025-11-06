import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface DiscardPostModalProps {
  visible: boolean;
  onDiscard: () => void;
  onContinueEditing: () => void;
}

export const DiscardPostModal: React.FC<DiscardPostModalProps> = ({
  visible,
  onDiscard,
  onContinueEditing,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200, // ✅ Consistente con otros modales (200ms)
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200, // ✅ Consistente con otros modales (200ms)
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleDiscard = () => {
    onDiscard();
  };

  const handleContinueEditing = () => {
    onContinueEditing();
  };

  const handleClose = () => {
    onContinueEditing();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleContinueEditing}
    >
      <Overlay as={Animated.View} style={{ opacity: fadeAnim }}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <OverlayBackground />
        </TouchableWithoutFeedback>

        <ModalContainer
          as={Animated.View}
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Title>¿Descartar publicación?</Title>

          <ActionsContainer>
            <DiscardButton
              onPress={handleDiscard}
              accessible
              accessibilityLabel="Descartar publicación"
              accessibilityRole="button"
            >
              <DiscardText>Descartar</DiscardText>
            </DiscardButton>

            <ContinueButton
              onPress={handleContinueEditing}
              accessible
              accessibilityLabel="Seguir editando la publicación"
              accessibilityRole="button"
            >
              <ContinueText>Seguir editando</ContinueText>
            </ContinueButton>
          </ActionsContainer>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos mejorados con layout flexible
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const OverlayBackground = styled.View`
  flex: 1;
  width: 100%;
`;

const ModalContainer = styled(Animated.View)`
  width: 312px;
  height: 88px;
  background-color: #ffffff;
  border-radius: 12px;
  justify-content: space-between;
  padding: 15px 22px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
  elevation: 5;
`;

const Title = styled.Text`
  font-size: 16px;
  color: #000000;
  font-weight: 600;
  font-family: "OpenSans-SemiBold", "System";
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const DiscardButton = styled.TouchableOpacity`
  margin-right: 16px;
`;

const DiscardText = styled.Text`
  color: #adadad;
  font-size: 14px;
  font-weight: 500;
  font-family: "OpenSans-Medium", "System";
`;

const ContinueButton = styled.TouchableOpacity``;

const ContinueText = styled.Text`
  color: #1291eb;
  font-size: 14px;
  font-weight: 600;
  font-family: "OpenSans-SemiBold", "System";
`;
