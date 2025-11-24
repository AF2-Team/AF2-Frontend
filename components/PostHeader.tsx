import React, { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

import { PostOptionsModal } from "./PostOptionsModal";
import { Colors, THEME } from "@/constants";
const defaultAvatar = require("../assets/images/default_avatar.png");

interface PostHeaderProps {
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    avatarShape?: "circle" | "square";
  };
  createdAt: string;
  isFollowing?: boolean;
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
  onOptionsPress?: () => void;
  postId: string;
  postContent?: string;
  onNotInterested?: (postId: string) => void;
}

export const PostHeader = ({
  user,
  createdAt,
  isFollowing = false,
  onFollowChange,
  onOptionsPress,
  postId,
  postContent,
  onNotInterested,
}: PostHeaderProps) => {
  const router = useRouter();
  const [following, setFollowing] = useState(isFollowing);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const handleFollowPress = () => {
    const newFollowState = !following;
    setFollowing(newFollowState);

    if (onFollowChange) {
      onFollowChange(user.id, newFollowState);
    }
  };

  const handleUserPress = () => {
    console.log(`Navegar al perfil de ${user.username}`);
  };

  const handleOptionsPress = () => {
    setShowOptionsModal(true);
    if (onOptionsPress) {
      onOptionsPress();
    }
  };

  const handleCloseModal = () => {
    setShowOptionsModal(false);
  };

  const handleNotInterested = () => {
    console.log("No me interesa el post:", postId);
    if (onNotInterested) {
      onNotInterested(postId);
    }
    setShowOptionsModal(false);
  };

  const handleFollowFromModal = () => {
    const newFollowState = true;
    setFollowing(newFollowState);

    if (onFollowChange) {
      onFollowChange(user.id, newFollowState);
    }
    setShowOptionsModal(false);
  };

  const handleUnfollow = () => {
    const newFollowState = false;
    setFollowing(newFollowState);

    if (onFollowChange) {
      onFollowChange(user.id, newFollowState);
    }
    setShowOptionsModal(false);
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seg`;
    } else if (minutes < 60) {
      return `${minutes} min`;
    } else if (hours < 24) {
      return `${hours} hr`;
    } else if (days === 1) {
      return "ayer";
    } else if (days < 365) {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <>
      <Container>
        <AvatarContainer onPress={handleUserPress}>
          <Avatar
            source={
              user.avatarUrl
                ? ({ uri: user.avatarUrl } as ImageSourcePropType)
                : defaultAvatar
            }
            avatarShape={user.avatarShape || "circle"}
          />
        </AvatarContainer>

        <UserInfo onPress={handleUserPress}>
          <Username>{user.username}</Username>
          <DateText>{formatRelativeTime(createdAt)}</DateText>
        </UserInfo>

        <ActionsContainer>
          {/* Botón de Seguir (solo visible si no se está siguiendo) */}
          {!following && (
            <FollowButton onPress={handleFollowPress}>
              <FollowButtonText>Seguir</FollowButtonText>
            </FollowButton>
          )}

          {/* Botón de Opciones */}
          <OptionsButton onPress={handleOptionsPress}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={Colors.textMuted}
            />
          </OptionsButton>
        </ActionsContainer>
      </Container>

      <PostOptionsModal
        visible={showOptionsModal}
        onClose={handleCloseModal}
        onNotInterested={handleNotInterested}
        onFollow={handleFollowFromModal}
        onUnfollow={handleUnfollow}
        isFollowing={following}
      />
    </>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${THEME.SPACING.MD}px ${THEME.SPACING.SCREEN_HORIZONTAL}px;
  background-color: ${Colors.background};
`;

const AvatarContainer = styled.TouchableOpacity`
  margin-right: ${THEME.SPACING.MD}px;
`;

const Avatar = styled.Image<{ avatarShape: "circle" | "square" }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ avatarShape }) =>
    avatarShape === "circle" ? "24px" : "8px"};
`;

const UserInfo = styled.TouchableOpacity`
  flex: 1;
`;

const Username = styled.Text`
  font-family: ${THEME.FONTS.SEMI_BOLD};
  font-size: ${THEME.TYPOGRAPHY.BODY}px;
  color: ${Colors.text};
  margin-bottom: ${THEME.SPACING.XS}px;
`;

const DateText = styled.Text`
  font-family: ${THEME.FONTS.LIGHT};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${Colors.textMuted};
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FollowButton = styled.TouchableOpacity`
  margin-right: ${THEME.SPACING.MD}px;
  padding: ${THEME.SPACING.XS}px ${THEME.SPACING.SM}px;
  background-color: ${Colors.action};
  border-radius: 20px;
`;

const FollowButtonText = styled.Text`
  font-family: ${THEME.FONTS.SEMI_BOLD};
  font-size: ${THEME.TYPOGRAPHY.CAPTION}px;
  color: ${Colors.textLight};
`;

const OptionsButton = styled.TouchableOpacity`
  padding: ${THEME.SPACING.XS}px;
`;
