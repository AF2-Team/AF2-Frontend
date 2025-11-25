import React from "react";
import styled from "styled-components/native";
import { Modal, TouchableWithoutFeedback } from "react-native";
import { Colors, THEME } from "@/constants";

interface PostOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onNotInterested: () => void;
  onFollow: () => void;
  onUnfollow?: () => void;
  isFollowing?: boolean;
}

export const PostOptionsModal: React.FC<PostOptionsModalProps> = ({
  visible,
  onClose,
  onNotInterested,
  onFollow,
  onUnfollow,
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

          {!isFollowing ? (
            <OptionButton onPress={onFollow}>
              <OptionText blue>Seguir</OptionText>
            </OptionButton>
          ) : (
            <OptionButton onPress={onUnfollow}>
              <OptionText red>Dejar de seguir</OptionText>
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
  background-color: ${Colors.modalOverlay};
`;

const ModalContent = styled.View`
  background-color: ${Colors.background};
  border-top-left-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
  border-top-right-radius: ${THEME.COMMON.BORDER_RADIUS.LG}px;
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
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.LG}px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.border};

  &:last-child {
    border-bottom-width: 0;
  }
`;

const OptionText = styled.Text<{ blue?: boolean; red?: boolean }>`
  font-size: ${THEME.TYPOGRAPHY.SUBTITLE}px;
  color: ${({ blue, red }) => {
    if (blue) return Colors.action;
    if (red) return Colors.error;
    return Colors.text;
  }};
  text-align: center;
  font-family: ${THEME.FONTS.REGULAR};
`;
