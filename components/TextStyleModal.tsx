import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, THEME } from "@/constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface TextStyleModalProps {
  visible: boolean;
  onClose: () => void;
  onStyleSelected: (style: string) => void;
  selectedStyle: string;
}

type TextStyleOption = "light" | "regular" | "semibold" | "bold";

export const TextStyleModal: React.FC<TextStyleModalProps> = ({
  visible,
  onClose,
  onStyleSelected,
  selectedStyle,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));

  const textStyles: {
    key: TextStyleOption;
    label: string;
    fontFamily: string;
  }[] = [
    { key: "light", label: "Light", fontFamily: THEME.FONTS.LIGHT },
    { key: "regular", label: "Regular", fontFamily: THEME.FONTS.REGULAR },
    { key: "semibold", label: "SemiBold", fontFamily: THEME.FONTS.SEMI_BOLD },
    { key: "bold", label: "Bold", fontFamily: THEME.FONTS.BOLD },
  ];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          delay: 50,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleStyleSelect = (style: TextStyleOption) => {
    onStyleSelected(style);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Overlay as={Animated.View} style={{ opacity: fadeAnim }}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <OverlayBackground />
        </TouchableWithoutFeedback>

        <ModalContainer
          as={Animated.View}
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          }}
        >
          <ModalContent>
            {textStyles.map((style, index) => (
              <StyleOption
                key={style.key}
                onPress={() => handleStyleSelect(style.key)}
                isLast={index === textStyles.length - 1}
              >
                <StyleText style={{ fontFamily: style.fontFamily }}>
                  {style.label}
                </StyleText>
                {selectedStyle === style.key && (
                  <Ionicons
                    name="checkmark-sharp"
                    size={20}
                    color={Colors.action}
                  />
                )}
              </StyleOption>
            ))}
          </ModalContent>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos actualizados con tus constantes
const Overlay = styled.View`
  flex: 1;
  background-color: ${Colors.modalOverlay};
  justify-content: flex-end;
`;

const OverlayBackground = styled.View`
  flex: 1;
`;

const ModalContainer = styled(Animated.View)`
  position: absolute;
  bottom: ${THEME.SPACING.NAV_BAR_HEIGHT + THEME.SPACING.LG}px;
  left: ${THEME.SPACING.LG}px;
  background-color: ${Colors.background};
  border-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  width: 180px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 6;
`;

const ModalContent = styled.View`
  padding: ${THEME.SPACING.XS}px 0;
`;

const StyleOption = styled.TouchableOpacity<{ isLast?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.LG}px;
  border-bottom-width: ${({ isLast }) =>
    isLast ? "0px" : StyleSheet.hairlineWidth};
  border-bottom-color: ${Colors.border};
`;

const StyleText = styled.Text`
  font-size: ${THEME.TYPOGRAPHY.SUBTITLE}px;
  color: ${Colors.text};
  flex: 1;
  font-family: ${THEME.FONTS.REGULAR};
`;
