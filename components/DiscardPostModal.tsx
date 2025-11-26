import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import styled from "styled-components/native";
import { Colors, THEME } from "@/constants";

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
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
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

        {/* CONTENEDOR PRINCIPAL - CENTRADO VERTICALMENTE */}
        <ModalContentContainer>
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
        </ModalContentContainer>
      </Overlay>
    </Modal>
  );
};

// NUEVO: Contenedor para centrar el modal verticalmente
const ModalContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: ${Colors.modalOverlay};
`;

const OverlayBackground = styled.View`
  flex: 1;
  width: 100%;
`;

const ModalContainer = styled(Animated.View)`
  width: 312px;
  background-color: ${Colors.modalBackground};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.MD}px;
  justify-content: space-between;
  padding: ${THEME.SPACING.LG}px ${THEME.SPACING.XL}px;
  ${THEME.COMMON.SHADOWS.MEDIUM}
`;

const Title = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.text};
  font-family: ${THEME.FONTS.SEMI_BOLD};
  text-align: center;
  margin-bottom: ${THEME.SPACING.MD}px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const DiscardButton = styled.TouchableOpacity`
  margin-right: ${THEME.SPACING.LG}px;
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
`;

const DiscardText = styled.Text`
  color: ${Colors.textMuted};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;

const ContinueButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.SM}px ${THEME.SPACING.MD}px;
`;

const ContinueText = styled.Text`
  color: ${Colors.action};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  font-family: ${THEME.FONTS.SEMI_BOLD};
`;
