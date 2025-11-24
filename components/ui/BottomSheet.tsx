import React from "react";
import styled from "styled-components/native";
import { Modal, TouchableWithoutFeedback } from "react-native";


export interface Option {
  id: string | number;
  label: string;
  onPress: () => void;
  isPrimary?: boolean;
  icon?: React.ReactNode;
}

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  options: Option[];
}


export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  options,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <OverlayWrapper>
        {/* Click en el fondo para cerrar */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Overlay />
        </TouchableWithoutFeedback>

        <ModalContent>
          {/* CAMBIO: Manija de arrastre integrada */}
          <Handle />
          
          {options.map((option, index) => (
            <OptionButton
              key={option.id}
              onPress={() => {
                option.onPress();
                onClose(); // Cerrar al ejecutar cualquier acción
              }}
              isLast={index === options.length - 1}
            >
                {option.icon && (<IconContainer>{option.icon}</IconContainer>)}
              <OptionText 
              isPrimary={option.isPrimary}
              hasIcon={!!option.icon}>
                {option.label}
               </OptionText>
            </OptionButton>
          ))}
        </ModalContent>
      </OverlayWrapper>
    </Modal>
  );
};


const OverlayWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 0;
  width: 100%;
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 8;
  position: absolute;
  bottom: 0;
`;

const Handle = styled.View`
  width: 40px;
  height: 5px; 
  border-radius: 2.5px;
  background-color: #ccc; 
  align-self: center; 
  margin-top: 8px; 
  margin-bottom: 16px;
`;

const OptionButton = styled.TouchableOpacity<{ isLast: boolean }>`
  padding: 16px 20px;
  border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
  border-bottom-color: #f0f0f0;
`;

const IconContainer = styled.View`
  margin-right: 15px; /* Espacio entre el icono y el texto */
  width: 24px; /* Asegura que todos los iconos tengan el mismo ancho para una alineación perfecta */
  align-items: center;
`;

const OptionText = styled.Text<{ isPrimary?: boolean, hasIcon: boolean }>`
  font-size: 16px;
  color: ${({ isPrimary }) => (isPrimary ? "#007AFF" : "#423646")};
  /* Alineación del texto: si hay icono, no lo centramos. Si no hay, lo centramos */
  text-align: ${({ hasIcon }) => (hasIcon ? "left" : "center")}; 
  flex: 1; /* Permite que el texto ocupe el espacio restante si hay icono */
  font-weight: 400;
`;