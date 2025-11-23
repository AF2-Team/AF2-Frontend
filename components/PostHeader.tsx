import React, { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { ImageSourcePropType } from "react-native";

import { PostOptionsModal } from "./PostOptionsModal";
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

const PRIMARY_COLOR = "#1291EB";
const WHITE_COLOR = "#FFFFFF";
const TEXT_PRIMARY_COLOR = "#423646";
const TEXT_SECONDARY_COLOR = "#687076";

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
              {/* Usamos el ícono de persona con signo más para "Seguir" */}
              <Ionicons
                name="person-add-outline"
                size={20}
                color={PRIMARY_COLOR}
              />
            </FollowButton>
          )}

          {/* Botón de Opciones */}
          <OptionsButton onPress={handleOptionsPress}>
            {/* Usamos el ícono de tres puntos verticales para opciones */}
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={TEXT_SECONDARY_COLOR}
            />
          </OptionsButton>
        </ActionsContainer>
      </Container>

      <PostOptionsModal
        visible={showOptionsModal}
        onClose={handleCloseModal}
        onNotInterested={handleNotInterested}
        onFollow={handleFollowFromModal}
        isFollowing={following}
      />
    </>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 15px;
  background-color: ${WHITE_COLOR};
`;

const AvatarContainer = styled.TouchableOpacity`
  margin-right: 12px;
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
  font-family: "OpenSans-SemiBold";
  font-size: 14px;
  color: ${TEXT_PRIMARY_COLOR};
  margin-bottom: 2px;
`;

const DateText = styled.Text`
  font-family: "OpenSans-Light";
  font-size: 12px;
  color: ${TEXT_SECONDARY_COLOR};
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FollowButton = styled.TouchableOpacity`
  margin-right: 12px;
  padding: 4px;
`;

const OptionsButton = styled.TouchableOpacity`
  padding: 4px;
`;
