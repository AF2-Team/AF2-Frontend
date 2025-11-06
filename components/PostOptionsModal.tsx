import React from "react";
import styled from "styled-components/native";
import { Modal, TouchableWithoutFeedback } from "react-native";

interface PostOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onNotInterested: () => void;
  onFollow: () => void;
  isFollowing?: boolean;
}

export const PostOptionsModal: React.FC<PostOptionsModalProps> = ({
  visible,
  onClose,
  onNotInterested,
  onFollow,
  isFollowing = false,
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
        <TouchableWithoutFeedback onPress={onClose}>
          <Overlay />
        </TouchableWithoutFeedback>

        <ModalContent>
          <OptionButton onPress={onNotInterested}>
            <OptionText>No me interesa</OptionText>
          </OptionButton>

          {!isFollowing && (
            <OptionButton onPress={onFollow}>
              <OptionText blue>Seguir</OptionText>
            </OptionButton>
          )}
        </ModalContent>
      </OverlayWrapper>
    </Modal>
  );
};

const OverlayWrapper = styled.View`
  flex: 1;
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

const OptionButton = styled.TouchableOpacity`
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;

  &:last-child {
    border-bottom-width: 0;
  }
`;

const OptionText = styled.Text<{ blue?: boolean }>`
  font-size: 16px;
  color: ${({ blue }) => (blue ? "#007AFF" : "#423646")};
  text-align: center;
  font-weight: 400;
`;
