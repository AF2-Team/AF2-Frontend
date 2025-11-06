import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const checkIcon = require("../assets/images/check-icon.png");

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
  const [slideAnim] = useState(new Animated.Value(20)); // ✅ Animación más sutil

  const textStyles: {
    key: TextStyleOption;
    label: string;
    fontFamily: string;
  }[] = [
    { key: "light", label: "Light", fontFamily: "OpenSans-Light" },
    { key: "regular", label: "Regular", fontFamily: "OpenSans-Regular" },
    { key: "semibold", label: "SemiBold", fontFamily: "OpenSans-SemiBold" },
    { key: "bold", label: "Bold", fontFamily: "OpenSans-Bold" },
  ];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0, // ✅ Flota hacia arriba suavemente
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
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
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
            opacity: fadeAnim, // ✅ Fade simultáneo para mayor suavidad
          }}
        >
          <ModalContent>
            {textStyles.map((style, index) => (
              <StyleOption
                key={style.key}
                onPress={() => handleStyleSelect(style.key)}
                isLast={index === textStyles.length - 1} // ✅ Para quitar borde del último
              >
                <StyleText style={{ fontFamily: style.fontFamily }}>
                  {style.label}
                </StyleText>
                {selectedStyle === style.key && (
                  <CheckIcon source={checkIcon} />
                )}
              </StyleOption>
            ))}
          </ModalContent>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// Estilos mejorados
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const OverlayBackground = styled.View`
  flex: 1;
`;

const ModalContainer = styled(Animated.View)`
  position: absolute;
  bottom: 90px; /* ✅ Justo encima del BottomBar */
  left: 24px; /* ✅ Alineado con el botón Aa */
  background-color: #ffffff;
  border-radius: 10px;
  width: 160px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
`;

const ModalContent = styled.View`
  padding: 4px 0; /* ✅ Padding más compacto */
`;

const StyleOption = styled.TouchableOpacity<{ isLast?: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom-width: ${({ isLast }) =>
    isLast ? "0px" : "1px"}; /* ✅ Líneas divisorias */
  border-bottom-color: #e5e5e5;
`;

const StyleText = styled.Text`
  font-size: 16px;
  color: #000000;
  flex: 1;
`;

const CheckIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #1291eb;
`;
